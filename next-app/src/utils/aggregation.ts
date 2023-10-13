import { PipelineStage } from 'mongoose';

const createAggregation = function (
  unit: string,
  bin: number = 1
): {
  allCharacterPipeline: PipelineStage[];
  singleCharacterPipeline: PipelineStage[];
} {
  let groupId: any = {};
  let dateFromParts: any = {};

  switch (unit) {
    default:
    case 'day':
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: {
          $subtract: [
            { $dayOfMonth: '$createdAt' },
            {
              $mod: [{ $subtract: [{ $dayOfMonth: '$createdAt' }, 1] }, bin]
            }
          ]
        }
      };
      dateFromParts = {
        year: '$_id.year',
        month: '$_id.month',
        day: '$_id.day'
      };
      break;

    case 'month':
      groupId = {
        year: { $year: '$createdAt' },
        month: {
          $subtract: [
            { $month: '$createdAt' },
            {
              $mod: [{ $subtract: [{ $month: '$createdAt' }, 1] }, bin]
            }
          ]
        }
      };
      dateFromParts = {
        year: '$_id.year',
        month: '$_id.month'
      };
      break;

    case 'year':
      groupId = {
        year: {
          $subtract: [
            { $year: '$createdAt' },
            {
              $mod: [{ $subtract: [{ $year: '$createdAt' }, 1] }, bin]
            }
          ]
        }
      };
      dateFromParts = {
        year: '$_id.year'
      };
      break;
  }

  const allCharacterPipeline: PipelineStage[] = [
    {
      $group: {
        _id: groupId,
        predictionTime: { $avg: '$predictionTime' }
      }
    },
    {
      $project: {
        _id: 0,
        createdAt: { $dateFromParts: dateFromParts },
        predictionTime: { $round: ['$predictionTime'] }
      }
    },
    { $sort: { createdAt: 1 } }
  ];

  const singleCharacterPipeline: PipelineStage[] = [
    {
      $group: {
        _id: {
          ...groupId,
          character: '$characterPredicted'
        },
        predictionTime: { $avg: '$predictionTime' }
      }
    },
    {
      $project: {
        _id: 0,
        character: '$_id.character',
        createdAt: { $dateFromParts: dateFromParts },
        predictionTime: { $round: ['$predictionTime'] }
      }
    },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: '$character',
        data: {
          $push: {
            createdAt: '$createdAt',
            predictionTime: '$predictionTime'
          }
        }
      }
    }
  ];

  return { allCharacterPipeline, singleCharacterPipeline };
};

export default createAggregation;
