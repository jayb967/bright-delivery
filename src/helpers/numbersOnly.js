export default function numbersOnly(value){
    const re = /^[0-9\b\.\+]+$/;

    if (value === '' || re.test(value)) {
        return true
    }

    return false

}