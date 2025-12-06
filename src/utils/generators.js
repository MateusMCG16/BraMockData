
export const generateCPF = (formatted = true) => {
    const randomDigit = () => Math.floor(Math.random() * 10);
    const digits = Array.from({ length: 9 }, randomDigit);

    const calculateDigit = (baseDigits) => {
        let sum = 0;
        let weight = baseDigits.length + 1;
        for (let digit of baseDigits) {
            sum += digit * weight--;
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    digits.push(calculateDigit(digits));
    digits.push(calculateDigit(digits));

    const cpf = digits.join('');
    return formatted
        ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : cpf;
};

export const generateCNPJ = (formatted = true) => {
    const randomDigit = () => Math.floor(Math.random() * 10);
    const digits = Array.from({ length: 8 }, randomDigit);
    // Add 0001
    digits.push(0, 0, 0, 1);

    const calculateDigit = (baseDigits) => {
        let sum = 0;
        let weight = baseDigits.length === 12 ? 5 : 6;
        for (let digit of baseDigits) {
            sum += digit * weight--;
            if (weight < 2) weight = 9;
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    digits.push(calculateDigit(digits));
    digits.push(calculateDigit(digits));

    const cnpj = digits.join('');
    return formatted
        ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        : cnpj;
};

export const generateRG = (formatted = true) => {
    // RG format is less standardized across states, but typically 9 digits
    const randomDigit = () => Math.floor(Math.random() * 10);
    const digits = Array.from({ length: 8 }, randomDigit);
    // Check digit for RG is often X or 0-9, but let's just do random 0-9 for simplicity as validation varies wildly
    digits.push(randomDigit());

    const rg = digits.join('');
    return formatted
        ? rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        : rg;
};

export const generatePhone = (formatted = true, type = 'any') => {
    const randomDigit = () => Math.floor(Math.random() * 10);
    // DDD between 11 and 99
    const ddd = Math.floor(Math.random() * (99 - 11 + 1)) + 11;

    let isMobile;
    if (type === 'mobile') {
        isMobile = true;
    } else if (type === 'landline') {
        isMobile = false;
    } else {
        // Randomly decide between mobile (true) and landline (false)
        isMobile = Math.random() > 0.5;
    }

    let numberPart = '';
    if (isMobile) {
        // Mobile: 9 + 8 digits
        numberPart = '9';
        for (let i = 0; i < 8; i++) numberPart += randomDigit();
    } else {
        // Landline: starts with 2, 3, 4, or 5 + 7 digits
        const firstDigit = Math.floor(Math.random() * 4) + 2;
        numberPart = String(firstDigit);
        for (let i = 0; i < 7; i++) numberPart += randomDigit();
    }

    const fullNumber = `${ddd}${numberPart}`;

    if (!formatted) return fullNumber;

    if (isMobile) {
        return fullNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        return fullNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
};
