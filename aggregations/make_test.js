db.WILDERNESS_BAYES.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$lookup: {
			    "from" : "WILDERNESS_BAYES_TRAIN",
			    "localField" : "ID",
			    "foreignField" : "ID",
			    "as" : "d"
			}
		},

		// Stage 2
		{
			$project: {
			    'ID': 1,
			    'comment': 1,
			    'words': 1,
			    'wordpairs': 1,
			    'label': 1,
			    'len': { $size: '$d' }
			}
		},

		// Stage 3
		{
			$match: {
			   'len': 0,
			}
		},

		// Stage 4
		{
			$project: {
			    'ID': 1,
			    'comment': 1,
			    'words': 1,
			    'wordpairs': 1,
			    'label': 1,
			}
		},

		// Stage 5
		{
			$out: "WILDERNESS_BAYES_TEST"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
