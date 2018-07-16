db.WILDERNESS_BAYES_TRAIN.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$unwind: {
			    path : "$words",
			}
		},

		// Stage 2
		{
			$group: {
			    '_id': '$words',
			    'count': { $sum: 1 },
			    'count_0': { $sum: { $cond: [ { $eq: [ '$label', '0' ] }, 1, 0 ] } },
			    'count_1': { $sum: { $cond: [ { $eq: [ '$label', '1' ] }, 1, 0 ] } },
			}
		},

		// Stage 3
		{
			$out: "WILDERNESS_BAYES_MODEL"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
