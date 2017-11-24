import React from 'react'
import gql from 'graphql-tag'
import {compose} from 'recompose'
import {graphql} from 'react-apollo'

const QUERY = gql`query allSalaries {
	allSalaries {id title progress}}
`
const MUTATION = gql`
	mutation calculateSalary($id: Int!) {
        calculateSalary(id: $id) {id title}
	}
`
const SUBSCRIPTION = gql`
    subscription salaryCalculationProgressed($id: Int!){
        salaryCalculationProgressed(id: $id){
            id
            progress
        }
    }
`;

const Salary = props => {
	console.log('salary: ', props)
	const {data: {loading, allSalaries}, calc} = props
	if (loading) {
		return (
			<p>Loading</p>
		)
	}
	
	return (
		<div>
			{allSalaries.map(x=>{
				const {id, title, progress} = x
				return (
					<div key={id}>
						<span>{title}</span>
						<span>{progress}</span>
						<button onClick={() => calc(id)}>Calculate</button>
					</div>
				)
			})}
		</div>
	)
}

export default compose(
	graphql(QUERY),
	graphql(MUTATION, {
		props: ({ownProps, mutate}) => ({
			calc: (id) => {
				ownProps.data.subscribeToMore({
					document: SUBSCRIPTION,
					variables: { id },
					updateQuery: (prev, {subscriptionData}) => {
						const {allSalaries} = prev
						if (!subscriptionData.data) {
							return prev;
						}
						
						const {id, progress} = subscriptionData.data.salaryCalculationProgressed
						const theOne = allSalaries.find(x=>x.id === id)
						const index = allSalaries.findIndex(x=>x.id === id)
						if (index < 0) {
							return prev
						}
						const ret = [
							...allSalaries.slice(0, index),
							{...theOne, progress},
							...allSalaries.slice(index + 1)
						]
						return {...prev, allSalaries: ret}
					}
				})
				
				return mutate ({
					variables: {id}
				})
			}
		})
	})
	
)(Salary)
