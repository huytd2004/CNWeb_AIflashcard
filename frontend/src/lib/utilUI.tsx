export const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
        english: '🇺🇸',
        chinese: '🇨🇳',
        japan: '🇯🇵',
        korea: '🇰🇷',
        vietnamese: '🇻🇳',
        germany: '🇩🇪',
        france: '🇫🇷',
    }
    return flags[lang] || '🌐'
}

export const getLanguageName = (lang: string) => {
    const names: { [key: string]: string } = {
        english: 'English',
        chinese: '中文',
        japan: '日本語',
        korea: '한국어',
        vietnamese: 'Tiếng Việt',
        germany: 'Deutsch',
        france: 'Français',
    }
    return names[lang] || 'Khác'
}

export const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
        CN: '🇨🇳',
        TW: '🇹🇼',
        HK: '🇭🇰',
        US: '🇺🇸',
        UK: '🇬🇧',
        FR: '🇫🇷',
        DE: '🇩🇪',
        JP: '🇯🇵',
        KR: '🇰🇷',
        ES: '🇪🇸',
        AU: '🇦🇺',
        CA: '🇨🇦',
        AT: '🇦🇹 ',
        VN: '🇻🇳',
    }
    return flags[country] || '🌐'
}
