import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './ThemeProvider';
import './DarkModeToggle.css';

const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="dark-mode-toggle">
      <Tooltip title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        <Button
          type="text"
          icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
          onClick={toggleTheme}
          className={`toggle-button ${theme}`}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        />
      </Tooltip>
    </div>
  );
};

export default DarkModeToggle;