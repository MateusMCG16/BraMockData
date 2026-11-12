const onlyDigits = (value) => String(value).replace(/\D/g, '');

export const formatCPF = (value, formatted = true) => {
    const digits = onlyDigits(value);
    return formatted
        ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : digits;
};

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

    return formatCPF(digits.join(''), formatted);
};

export const formatCNPJ = (value, formatted = true) => {
    const digits = onlyDigits(value);
    return formatted
        ? digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        : digits;
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

    return formatCNPJ(digits.join(''), formatted);
};

export const formatRG = (value, formatted = true) => {
    const digits = onlyDigits(value);
    return formatted
        ? digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
        : digits;
};

export const generateRG = (formatted = true) => {
    // RG format is less standardized across states, but typically 9 digits
    const randomDigit = () => Math.floor(Math.random() * 10);
    const digits = Array.from({ length: 8 }, randomDigit);
    // Check digit for RG is often X or 0-9, but let's just do random 0-9 for simplicity as validation varies wildly
    digits.push(randomDigit());

    return formatRG(digits.join(''), formatted);
};

export const formatPhone = (value, formatted = true) => {
    const digits = onlyDigits(value);
    if (!formatted) return digits;

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const generatePhone = (formatted = true, typeOrOptions = 'any') => {
    const type = typeof typeOrOptions === 'string' ? typeOrOptions : typeOrOptions?.type || 'any';
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

    return formatPhone(`${ddd}${numberPart}`, formatted);
};

export const formatCEP = (value, formatted = true) => {
    const digits = onlyDigits(value);
    return formatted
        ? digits.replace(/(\d{5})(\d{3})/, '$1-$2')
        : digits;
};

export const generateCEP = (formatted = true) => {
    const randomDigit = () => Math.floor(Math.random() * 10);
    const digits = Array.from({ length: 8 }, randomDigit);
    return formatCEP(digits.join(''), formatted);
};

export const formatCreditCard = (value, formatted = true) => {
    const digits = onlyDigits(value);
    return formatted
        ? digits.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
        : digits;
};

export const generateCreditCard = (formatted = true) => {
    const randomDigit = () => Math.floor(Math.random() * 10);
    // Start with 4 (Visa) for simplicity or random between 3, 4, 5, 6
    const firstDigit = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, 6
    const digits = [firstDigit];
    for (let i = 0; i < 14; i++) digits.push(randomDigit());

    // Luhn algorithm for check digit
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        let digit = digits[digits.length - 1 - i];
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    const checkDigit = (sum * 9) % 10;
    digits.push(checkDigit);

    return formatCreditCard(digits.join(''), formatted);
};

export const formatDate = (value, formatted = true) => {
    const raw = String(value);
    const brMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (brMatch) {
        const [, day, month, year] = brMatch;
        return formatted ? `${day}/${month}/${year}` : `${year}-${month}-${day}`;
    }
    if (isoMatch) {
        const [, year, month, day] = isoMatch;
        return formatted ? `${day}/${month}/${year}` : `${year}-${month}-${day}`;
    }
    return raw;
};

export const generateDate = (formatted = true) => {
    // Generate date between 1950 and 2023
    const start = new Date(1950, 0, 1);
    const end = new Date(2023, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return formatDate(`${year}-${month}-${day}`, formatted);
};

export const generateEmail = () => {
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'uol.com.br', 'hotmail.com'];
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let user = '';
    const length = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < length; i++) {
        user += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${user}@${domain}`;
};

export const generateName = () => {
    const firstNames = [
        'Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena',
        'Igor', 'Julia', 'Lucas', 'Mariana', 'Nicolas', 'Olivia', 'Pedro', 'Rafael',
        'Sofia', 'Thiago', 'Vitoria', 'Yuri', 'João', 'Maria', 'José', 'Francisco'
    ];
    const lastNames = [
        'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
        'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
        'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade'
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Randomly decide if one or two last names
    return Math.random() > 0.3 ? `${firstName} ${lastName1} ${lastName2}` : `${firstName} ${lastName1}`;
};
