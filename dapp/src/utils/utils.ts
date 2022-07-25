export const abbreAddress = (d: string) => {
    if (d?.length > 0) {
        let first = d.slice(0, 4);
        let last = d.slice(d.length - 4, d.length);
        return `${first}...${last}`;
    }
    return '';
}
