export function formatDateLabel(dateKey: string): string {
    const [classTime, fullDate] = dateKey.split(' - ')
    const [day, month] = (fullDate || '').split('/')

    if (classTime && day && month) {
        return `${classTime} - ${day}/${month}`
    }

    return dateKey
}

export function formatDate(date: Date): string {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
}