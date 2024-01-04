import avatarRuslan from '@public/images/avatar-ruslan.jpg';
import avatarDanylo from '@public/images/avatar-danylo.jpg';

// Types
import { DeveloperData } from '@src/types';

const DEVELOPERS: DeveloperData[] = [
  {
    img: avatarRuslan,
    buttons: [
      {
        href: 'https://www.linkedin.com/in/russell-kotliarenko/',
        iconKey: 'linkedin',
        newTab: true
      },
      {
        href: 'https://www.linkedin.com/in/russell-kotliarenko/',
        iconKey: 'portfolio',
        newTab: true
      },
      { href: 'https://github.com/ruslankotliar', iconKey: 'github', newTab: true },
      { href: 'mailto:ruslankot101@gmail.com', iconKey: 'email', newTab: true }
    ],
    name: 'Russell Kotliarenko',
    position: 'Software Engineer',
    area: [
      'Frontend Design',
      'Backend Systems',
      'UI/UX Principles',
      'Database Management',
      'AWS Cloud Solutions',
      'Continuous Integration/Deployment'
    ]
  },
  {
    img: avatarDanylo,
    buttons: [
      { href: 'https://www.linkedin.com/in/danylo-sushko/', iconKey: 'linkedin', newTab: true },
      {
        href: 'https://daunyl.github.io/portfolio/index.html',
        iconKey: 'portfolio',
        newTab: true
      },
      { href: 'https://github.com/daunyl', iconKey: 'github', newTab: true },
      { href: 'mailto:danil.su04@gmail.com', iconKey: 'email', newTab: true }
    ],
    name: 'Sushko Danylo',
    position: 'Data Scientist',
    area: [
      'Statistical Analysis',
      'Machine Learning Algorithms',
      'Data Visualization',
      'Predictive Modeling',
      'Feature Engineering',
      'Data Storytelling',
      'Data Mining',
      'Deep Learning Principles',
      'Image Classification',
      'Time Series Analysis',
      'Hypothesis Testing'
    ]
  }
];

const UNKNOWN_ERROR_MESSAGE = 'Unknown error occurred. Please try again later.';

// fake high demands message
const TIMEOUT_TRY_AGAIN = 'High demand! Please try again shortly. We appreciate your patience.';

export { DEVELOPERS, UNKNOWN_ERROR_MESSAGE, TIMEOUT_TRY_AGAIN };
