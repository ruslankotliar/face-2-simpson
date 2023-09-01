import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';

export const requestStatistics = async function () {
  const { data } = await axios.get(PYTHON_API_ROUTES.REQUEST_STATISTICS);

  return data;
};
