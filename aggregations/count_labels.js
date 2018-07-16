db.WILDERNESS_BAYES_TRAIN.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$group: {
			    '_id': 'counts',
			    'count_0': { $sum: { $cond: [ { $eq: [ '$label', '0' ] }, 1, 0 ] } },
			    'count_1': { $sum: { $cond: [ { $eq: [ '$label', '1' ] }, 1, 0 ] } }
			}
		},

		// Stage 2
		{
			$out: "WILDERNESS_BAYES_MODEL_LABEL"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
