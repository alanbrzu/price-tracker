export const apiUrl = import.meta.env.VITE_API_URL
export const wsUrl = import.meta.env.VITE_WS_URL

const formatter = new Intl.NumberFormat(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 6 })

export const formatNumber = (number: number) => formatter.format(number)
