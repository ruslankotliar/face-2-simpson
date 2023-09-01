import { REQUEST_URL_KEYS } from '@app/_constants';
import axios from 'axios';

const getStatistics = async function () {
  try {
    const { data } = await axios.get(REQUEST_URL_KEYS.STATISTICS);
    console.log(data);

    return data;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

export default async function Dashboard() {
  const statistics = await getStatistics();

  return <div>Dashboard</div>;
}
