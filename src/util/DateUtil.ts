export function formatDateLabel(dateKey: string): string {
    const [classTime, fullDate] = dateKey.split(' - ')
    const [day, month] = (fullDate || '').split('/')

    if (classTime && day && month) {
        return `${classTime} - ${day}/${month}`
    }

    return dateKey
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR')
}