export default function cleanText(value) {

    if (!value) {
        return ''
    }
    const cleaned = value.replace(/[^A-Za-z0-9- _$#.,!?&()"'+=`]/g, '');
    return cleaned
}