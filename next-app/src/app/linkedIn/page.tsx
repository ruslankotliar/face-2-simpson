import Image from 'next/image';
import avatarRuslan from '@public/images/avatar-ruslan.jpg';
import AboutCard from '@src/components/misc/AboutCard';

export default function LinkedIn() {
  const developers = [
    { img: avatarRuslan, href: '' },
    { img: avatarRuslan, href: 'fads' }
  ];

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-4 w-fit h-fit">
        {developers.map(({ img, href }) => (
          <div key={`${img.src}${href}`} className="flex-1 h-96 w-96 relative cursor-pointer">
            <AboutCard img={img} href={href} />
            {/* <div className="w-full h-full absolute top-0 left-0 z-20 shadow-inner-basic hover:shadow-inner-hovered transition-shadow">
              AboutCard
            </div>
            <Image
              src={avatarRuslan}
              alt="Avatar Ruslan Kotliarenko"
              fill
              style={{ objectFit: 'contain' }}
              className="z-10"
            /> */}
          </div>
        ))}
      </div>
    </div>
  );
}
