"""Mongobayes aggregations."""

count_labels = [
    {
        '$group': {
            '_id': 'counts',
            'count_0': {'$sum': {'$cond': [{'$eq': ['$label', '0']}, 1, 0]}},
            'count_1': {'$sum': {'$cond': [{'$eq': ['$label', '1']}, 1, 0]}}
        }
    },
    {
        '$out': 'WILDERNESS_BAYES_MODEL_LABEL'
    },
]

make_test = [
    {
        '$lookup': {
            'from': 'WILDERNESS_BAYES_TRAIN',
            'localField': 'ID',
            'foreignField': 'ID',
            'as': 'd'
        }
    },
    {
        '$project': {
            'ID': 1,
            'comment': 1,
            'words': 1,
            'wordpairs': 1,
            'label': 1,
            'len': {'$size': '$d'}
        }
    },
    {
        '$match': {
            'len': 0,
        }
    },
    {
        '$project': {
            'ID': 1,
            'comment': 1,
            'words': 1,
            'wordpairs': 1,
            'label': 1,
        }
    },
    {
        '$out': 'WILDERNESS_BAYES_TEST'
    },
]

make_train = [
    {
        '$sample': {
            'size': 1500
        }
    },
    {
        '$out': 'WILDERNESS_BAYES_TRAIN'
    },
]

test = [
    {
        '$project': {
            'label': 1,
            'ID': 1,
            'words': 1
        }
    },

    {
        '$unwind': {
            'path': '$words',
        }
    },

    {
        '$lookup': {
            'from': 'WILDERNESS_BAYES_MODEL',
            'localField': 'words',
            'foreignField': '_id',
            'as': 'model'
        }
    },

    {
        '$unwind': {
            'path': '$model',
        }
    },


    {
        '$group': {
            '_id': '$ID',
            'label': {'$first': '$label'},
            'p_0': {'$push': {'$cond': [{'$ne': ['$model.count_0', 0]}, '$model.count_0', 1]}},
            'p_1': {'$push': {'$cond': [{'$ne': ['$model.count_1', 0]}, '$model.count_1', 1]}},
        }
    },

    {
        '$lookup': {
            'from': 'WILDERNESS_BAYES_MODEL_LABEL',
            'localField': 'a',
            'foreignField': 'a',
            'as': 'label_counts'
        }
    },

    {
        '$unwind': {
            'path': '$label_counts',
        }
    },

    {
        '$project': {
            'label': 1,
            'p_0': {'$reduce': {
                'input': '$p_0',
                'initialValue': '$label_counts.count_0',
                'in': {'$multiply': ['$$value', '$$this']},
            }},
            'p_1': {'$reduce': {
                'input': '$p_1',
                'initialValue': '$label_counts.count_1',
                'in': {'$multiply': ['$$value', '$$this']},
            }},
        }
    },

    {
        '$project': {
            'l': '$label',
            'p': {'$cond': [{'$gt': ['$p_0', '$p_1']}, '0', '1']}
        }
    },

    {
        '$project': {
            'l': 1,
            'p': 1,
            'isCorrect': {'$eq': ['$l', '$p']},
            'l0p0': {'$and': [{'$eq': ['$l', '0']}, {'$eq': ['$p', '0']}]},
            'l0p1': {'$and': [{'$eq': ['$l', '0']}, {'$eq': ['$p', '1']}]},
            'l1p0': {'$and': [{'$eq': ['$l', '1']}, {'$eq': ['$p', '0']}]},
            'l1p1': {'$and': [{'$eq': ['$l', '1']}, {'$eq': ['$p', '1']}]},

        }
    },

    {
        '$group': {
            '_id': 0,
            'count': {'$sum': 1},
            'count_0': {'$sum': {'$cond': [{'$eq': ['$l', '0']}, 1, 0]}},
            'count_1': {'$sum': {'$cond': [{'$eq': ['$l', '1']}, 1, 0]}},
            'isCorrect': {'$sum': {'$cond': ['$isCorrect', 1, 0]}},
            'l0p0': {'$sum': {'$cond': ['$l0p0', 1, 0]}},
            'l0p1': {'$sum': {'$cond': ['$l0p1', 1, 0]}},
            'l1p0': {'$sum': {'$cond': ['$l1p0', 1, 0]}},
            'l1p1': {'$sum': {'$cond': ['$l1p1', 1, 0]}},
        }
    },
    {
        '$project': {
            'isCorrect': 1,
            'count': 1,
            'l0p0': 1,
            'l0p1': 1,
            'l1p0': 1,
            'l1p1': 1,
            'accuracy': {'$multiply': [{'$divide': ['$isCorrect', '$count']}, 100]},
            'accuracy_0': {'$multiply': [{'$divide': ['$l0p0', '$count_0']}, 100]},
            'accuracy_1': {'$multiply': [{'$divide': ['$l1p1', '$count_1']}, 100]},
            'p_l0p0':   {'$multiply': [{'$divide': ['$l0p0', '$count']}, 100]},
            'p_l0p1':   {'$multiply': [{'$divide': ['$l0p1', '$count']}, 100]},
            'p_l1p0':   {'$multiply': [{'$divide': ['$l1p0', '$count']}, 100]},
            'p_l1p1':   {'$multiply': [{'$divide': ['$l1p1', '$count']}, 100]},
        }
    },
],

train_model = [
    {
        '$unwind': {
            'path': '$words',
        }
    },
    {
        '$group': {
            '_id': '$words',
            'count': {'$sum': 1},
            'count_0': {'$sum': {'$cond': [{'$eq': ['$label', '0']}, 1, 0]}},
            'count_1': {'$sum': {'$cond': [{'$eq': ['$label', '1']}, 1, 0]}},
        }
    },
    {
        '$out': 'WILDERNESS_BAYES_MODEL'
    },

]
