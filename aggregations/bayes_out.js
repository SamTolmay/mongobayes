db.WILDERNESS_ERI_WORD.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			'VerbWork': { $ne: null }
			}
		},

		// Stage 2
		{
			$project: {
			    'ID': 1,
			    'VerbWork': 1,
			    'VerbWorkC': 1,
			    'VerbWorkC2': 1,
			}
		},

		// Stage 3
		{
			$lookup: {
			    "from" : "WILDERNESS_ERI",
			    "localField" : "ID",
			    "foreignField" : "ID",
			    "as" : "d"
			}
		},

		// Stage 4
		{
			$unwind: {
			    path : "$d",
			}
		},

		// Stage 5
		{
			$match: {
			'd.Level': { $ne: null }
			}
		},

		// Stage 6
		{
			$project: {
			    'ID': 1,
			    'VerbWork': 1,
			    'VerbWorkC': 1,
			    'VerbWorkC2': 1,
			    'Level': { $switch: { branches: 
			                      [ { case: { $eq: [ '$d.Level', 'Junior staff' ] }, then: 'General' },
			                        { case: { $eq: [ '$d.Level', 'General staff' ] }, then: 'General' },
			                        { case: { $eq: [ '$d.Level', 'Middle Management Staff' ] }, then: 'Management' },
			                        { case: { $eq: [ '$d.Level', 'Senior Management Staff' ] }, then: 'Management' },
			                    ],
			                      default: 'neutral'
			                  } },
			}
		},

		// Stage 7
		{
			$out: "WILDERNESS_TEST"
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
