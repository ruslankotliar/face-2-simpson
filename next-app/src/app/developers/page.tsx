// Components
import AboutCard from '@src/components/misc/AboutCard';

// Constants
import { DEVELOPERS } from '@src/constants';

export default function LinkedIn() {
  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)] my-8 md:my-0 flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-fit h-fit">
        {DEVELOPERS.map((dev) => (
          <div
            key={`${dev.name}${dev.area.toString()}`}
            className="flex items-center justify-center flex-1 h-96 w-96 relative cursor-pointer"
          >
            <AboutCard dev={dev} />
          </div>
        ))}
      </div>
    </div>
  );
}
