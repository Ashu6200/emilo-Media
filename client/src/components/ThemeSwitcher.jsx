import { useTheme } from '../hooks/hooks';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className='flex items-center justify-center mx-1'>
      {theme === 'light' ? (
        <div className='grid place-items-center gap-1 text-center text-xs'>
          <Moon
            className='cursor-pointer'
            fill='block'
            size={20}
            onClick={() => setTheme('dark')}
          />
          <span>Dark</span>
        </div>
      ) : (
        <div className='grid place-items-center gap-1 text-center text-xs'>
          <Sun
            className='cursor-pointer'
            size={20}
            onClick={() => setTheme('light')}
          />
          <span>Light</span>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
