db.WILDERNESS_BAYES.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$sample: {
			    'size': 1500
			}
		},

		// Stage 2
		{
			$out: "WILDERNESS_BAYES_TRAIN"
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
