/* eslint-disable react/react-in-jsx-scope */
'use client';

import i18n from 'i18next';

export  function LanguageSwitcher() {
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('uk')}>Українська</button>
    </div>
  );
}
