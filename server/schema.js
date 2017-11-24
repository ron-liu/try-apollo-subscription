import pubsub from './pubsub'
import { makeExecutableSchema } from 'graphql-tools';
import { withFilter } from 'graphql-subscriptions';

const typeDefs = `
	type Salary {
		id: Int
		title: String
		progress: Int
	}
	
	type SalaryCalculationProgress {
		id: Int
		progress: Int # 100 based
	}
	
	type Query {
		allSalaries: [Salary]
	}
	
	type Mutation {
		calculateSalary(id: Int!): Salary
	}
	
	type Subscription {
	  salaryCalculationProgressed(id: Int!): SalaryCalculationProgress
	}

	schema {
	  subscription: Subscription
	  query: Query,
	  mutation: Mutation
	}
`

const resolvers = {
	Query: {
		allSalaries: () => [
			{id:1, title: 'fs'},
			{id:2, title: 'jason'}
		]
	},
	Mutation: {
		calculateSalary: async (root, {id}) => {
			for (let i = 0; i < 100; i ++) {
				await new Promise(res=>setTimeout(()=> res(), 1000))
				pubsub.publish('salaryCalculationProgressed', {
					salaryCalculationProgressed: {id, progress: i }
				})
			}
		}
	},
	Subscription: {
		salaryCalculationProgressed: {
			subscribe: withFilter(() => pubsub.asyncIterator('salaryCalculationProgressed'), (payload, variables) => {
				console.log(778, payload, variables)
				return payload.salaryCalculationProgressed.id === variables.id;
			}),
		}
	},
}

export default makeExecutableSchema({
	typeDefs,
	resolvers,
})
