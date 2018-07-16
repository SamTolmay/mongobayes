// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 11 - excluded
		stage: 11,  source: {
			$match: {
			    'l': '0',
			    'p': '1'
			}
		}
	},
]

db.WILDERNESS_BAYES_TEST.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$project: {
			    'label': 1,
			    'ID': 1,
			    'words': 1
			}
		},

		// Stage 2
		{
			$unwind: {
			    path : "$words",
			}
		},

		// Stage 3
		{
			$lookup: {
			    "from" : "WILDERNESS_BAYES_MODEL",
			    "localField" : "words",
			    "foreignField" : "_id",
			    "as" : "model"
			}
		},

		// Stage 4
		{
			$unwind: {
			    path : "$model",
			}
		},

		// Stage 5
		{
			$group: {
			    '_id': '$ID',
			    'label': { $first: '$label' },
			    'p_0': { $push: { $cond: [ { $ne: [ '$model.count_0', 0 ] }, '$model.count_0', 1 ] } },
			    'p_1': { $push: { $cond: [ { $ne: [ '$model.count_1', 0 ] }, '$model.count_1', 1 ] } },
			}
		},

		// Stage 6
		{
			$lookup: {
			    "from" : "WILDERNESS_BAYES_MODEL_LABEL",
			    "localField" : "a",
			    "foreignField" : "a",
			    "as" : "label_counts"
			}
		},

		// Stage 7
		{
			$unwind: {
			    path : "$label_counts",
			}
		},

		// Stage 8
		{
			$project: {
			    'label': 1,
			    'p_0': { $reduce: {
			               'input': '$p_0',
			               'initialValue': '$label_counts.count_0',
			               'in': { $multiply: [ '$$value', '$$this' ] },
			    } },
			    'p_1': { $reduce: {
			               'input': '$p_1',
			               'initialValue': '$label_counts.count_1',
			               'in': { $multiply: [ '$$value', '$$this' ] },
			    } },
			}
		},

		// Stage 9
		{
			$project: {
			    'l': '$label',
			    'p': { $cond: [ { $gt: [ '$p_0', '$p_1' ] }, '0', '1' ] }
			}
		},

		// Stage 10
		{
			$project: {
			    'l': 1,
			    'p': 1,
			    'isCorrect': { $eq: [ '$l', '$p' ] },
			    'l0p0': { $and: [ { $eq: [ '$l', '0' ] }, { $eq: [ '$p', '0' ] } ] },
			    'l0p1': { $and: [ { $eq: [ '$l', '0' ] }, { $eq: [ '$p', '1' ] } ] },
			    'l1p0': { $and: [ { $eq: [ '$l', '1' ] }, { $eq: [ '$p', '0' ] } ] },
			    'l1p1': { $and: [ { $eq: [ '$l', '1' ] }, { $eq: [ '$p', '1' ] } ] },
			    
			}
		},

		// Stage 12
		{
			$group: {
			    '_id': 0,
			    'count' : { $sum: 1 },
			    'count_0': { $sum: { $cond: [ { $eq: [ '$l', '0' ] }, 1, 0 ] } },
			    'count_1': { $sum: { $cond: [ { $eq: [ '$l', '1' ] }, 1, 0 ] } },
			    'isCorrect': { $sum: { $cond: [ '$isCorrect', 1, 0 ] } },
			    'l0p0': { $sum: { $cond: [ '$l0p0', 1, 0 ] } },
			    'l0p1': { $sum: { $cond: [ '$l0p1', 1, 0 ] } },
			    'l1p0': { $sum: { $cond: [ '$l1p0', 1, 0 ] } },
			    'l1p1': { $sum: { $cond: [ '$l1p1', 1, 0 ] } },
			}
		},

		// Stage 13
		{
			$project: {
			    'isCorrect': 1,
			    'count': 1,
			    'l0p0': 1,
			    'l0p1': 1,
			    'l1p0': 1,
			    'l1p1': 1,
			    'accuracy': { $multiply: [ { $divide: [ '$isCorrect', '$count' ] }, 100 ] },
			    'accuracy_0': { $multiply: [ { $divide: [ '$l0p0', '$count_0' ] }, 100 ] },
			    'accuracy_1': { $multiply: [ { $divide: [ '$l1p1', '$count_1' ] }, 100 ] },
			    'p_l0p0':   { $multiply: [ { $divide: [ '$l0p0', '$count' ] }, 100 ] },
			    'p_l0p1':   { $multiply: [ { $divide: [ '$l0p1', '$count' ] }, 100 ] },
			    'p_l1p0':   { $multiply: [ { $divide: [ '$l1p0', '$count' ] }, 100 ] },
			    'p_l1p1':   { $multiply: [ { $divide: [ '$l1p1', '$count' ] }, 100 ] },
			}
		},
	],

	// Options
	{
		cursor: {
			batchSize: 50
		}
	}

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
