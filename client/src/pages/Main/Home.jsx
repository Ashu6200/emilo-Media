import Feeds from '../../components/layout/Feeds';
import ProfileCard from '../../components/ProfileCard';
import Suggestuser from '../../components/Suggestuser';

const Home = () => {
  return (
    <section
      className='mx-auto grid h-full max-w-6xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[280px_minmax(0,1fr)] 
                    lg:grid-cols-[280px_minmax(0,1fr)_240px]'
    >
      <aside className='hidden md:block overflow-hidden'>
        <ProfileCard />
        <div className='mt-4 block lg:hidden'>
          <Suggestuser />
        </div>
      </aside>
      <section
        aria-label='Feed'
        className='min-h-0 overflow-y-auto overscroll-contain rounded-lg'
      >
        <Feeds />
      </section>
      <aside className='hidden lg:block overflow-hidden'>
        <Suggestuser />
      </aside>
    </section>
  );
};

export default Home;
