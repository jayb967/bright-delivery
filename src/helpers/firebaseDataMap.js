export default (s) => {
    if (!s) return [];

    const array = s.map((doc) => {
        
        const dat = doc.data()
        const data = {
            ...dat
        }
        data.id = doc.id
        return data
    })

    return array
}