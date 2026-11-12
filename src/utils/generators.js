const onlyDigits = (value) => String(value).replace(/\D/g, '');
const onlyAlnum = (value) => String(value).toUpperCase().replace(/[^0-9A-Z]/g, '');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDigit = () => randomInt(0, 9);
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

// --- CPF ---

export const CPF_REGIONS = [
    { code: 'any', label: 'Qualquer UF' },
    { code: '0', label: 'RS' },
    { code: '1', label: 'DF, GO, MS, MT, TO' },
    { code: '2', label: 'AC, AM, AP, PA, RO, RR' },
    { code: '3', label: 'CE, MA, PI' },
    { code: '4', label: 'AL, PB, PE, RN' },
    { code: '5', label: 'BA, SE' },
    { code: '6', label: 'MG' },
    { code: '7', label: 'ES, RJ' },
    { code: '8', label: 'SP' },
    { code: '9', label: 'PR, SC' },
];

export const formatCPF = (value, formatted = true) => {
    const digits = onlyDigits(value);
    return formatted
        ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : digits;
};

export const generateCPF = (formatted = true, options = {}) => {
    const region = options?.region ?? 'any';

    let digits;
    do {
        digits = Array.from({ length: 9 }, randomDigit);
        if (region !== 'any') {
            digits[8] = Number(region);
        }
    } while (new Set(digits).size === 1);

    const calculateDigit = (baseDigits) => {
        let sum = 0;
        let weight = baseDigits.length + 1;
        for (const digit of baseDigits) {
            sum += digit * weight--;
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    digits.push(calculateDigit(digits));
    digits.push(calculateDigit(digits));

    return formatCPF(digits.join(''), formatted);
};

// --- CNPJ ---

const CNPJ_ALNUM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CNPJ_ALPHA_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const formatCNPJ = (value, formatted = true) => {
    const chars = onlyAlnum(value);
    return formatted
        ? chars.replace(/^([0-9A-Z]{2})([0-9A-Z]{3})([0-9A-Z]{3})([0-9A-Z]{4})(\d{2})$/, '$1.$2.$3/$4-$5')
        : chars;
};

export const generateCNPJ = (formatted = true, options = {}) => {
    const alphanumeric = Boolean(options?.alphanumeric);
    const branchMode = options?.branchMode ?? '0001';

    const calculateCheckDigit = (baseChars) => {
        let sum = 0;
        let weight = baseChars.length === 12 ? 5 : 6;
        for (const char of baseChars) {
            // Regra oficial da Receita Federal (IN RFB 2.229/2024): ASCII - 48
            const numericValue = char.charCodeAt(0) - 48;
            sum += numericValue * weight--;
            if (weight < 2) weight = 9;
        }
        const remainder = sum % 11;
        return remainder < 2 ? '0' : String(11 - remainder);
    };

    let base;
    do {
        if (alphanumeric) {
            const root = Array.from({ length: 8 }, () =>
                CNPJ_ALNUM_CHARS.charAt(Math.floor(Math.random() * CNPJ_ALNUM_CHARS.length))
            );
            // Garante ao menos uma letra na raiz quando o modo alfanumérico está ativo
            if (!root.some((ch) => ch >= 'A' && ch <= 'Z')) {
                root[randomInt(0, 7)] = CNPJ_ALPHA_CHARS.charAt(Math.floor(Math.random() * CNPJ_ALPHA_CHARS.length));
            }
            const branch =
                branchMode === 'random'
                    ? Array.from({ length: 4 }, () =>
                        CNPJ_ALNUM_CHARS.charAt(Math.floor(Math.random() * CNPJ_ALNUM_CHARS.length))
                    )
                    : ['0', '0', '0', '1'];
            base = [...root, ...branch];
        } else {
            const root = Array.from({ length: 8 }, () => String(randomDigit()));
            const branch =
                branchMode === 'random'
                    ? String(randomInt(1, 9999)).padStart(4, '0').split('')
                    : ['0', '0', '0', '1'];
            base = [...root, ...branch];
        }
    } while (new Set(base).size === 1);

    base.push(calculateCheckDigit(base));
    base.push(calculateCheckDigit(base));

    return formatCNPJ(base.join(''), formatted);
};

// --- RG (SSP-SP Módulo 11) ---

export const formatRG = (value, formatted = true) => {
    const chars = String(value).toUpperCase().replace(/[^0-9X]/g, '');
    return formatted
        ? chars.replace(/^(\d{2})(\d{3})(\d{3})([0-9X])$/, '$1.$2.$3-$4')
        : chars;
};

export const generateRG = (formatted = true, options = {}) => {
    const allowX = options?.allowX ?? true;
    const weights = [2, 3, 4, 5, 6, 7, 8, 9];

    let digits;
    let dv;

    do {
        digits = Array.from({ length: 8 }, randomDigit);
        if (new Set(digits).size === 1) continue;

        const sum = digits.reduce((acc, digit, idx) => acc + digit * weights[idx], 0);
        const remainder = sum % 11;

        if (remainder === 0) {
            dv = '0';
        } else if (remainder === 1) {
            dv = 'X';
        } else {
            dv = String(11 - remainder);
        }
    } while (new Set(digits).size === 1 || (!allowX && dv === 'X'));

    return formatRG(`${digits.join('')}${dv}`, formatted);
};

// --- Telefone (DDDs oficiais Anatel) ---

export const BRAZIL_DDDS_BY_UF = {
    AC: ['68'],
    AL: ['82'],
    AM: ['92', '97'],
    AP: ['96'],
    BA: ['71', '73', '74', '75', '77'],
    CE: ['85', '88'],
    DF: ['61'],
    ES: ['27', '28'],
    GO: ['62', '64'],
    MA: ['98', '99'],
    MG: ['31', '32', '33', '34', '35', '37', '38'],
    MS: ['67'],
    MT: ['65', '66'],
    PA: ['91', '93', '94'],
    PB: ['83'],
    PE: ['81', '87'],
    PI: ['86', '89'],
    PR: ['41', '42', '43', '44', '45', '46'],
    RJ: ['21', '22', '24'],
    RN: ['84'],
    RO: ['69'],
    RR: ['95'],
    RS: ['51', '53', '54', '55'],
    SC: ['47', '48', '49'],
    SE: ['79'],
    SP: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    TO: ['63'],
};

const ALL_VALID_DDDS = Object.values(BRAZIL_DDDS_BY_UF).flat().sort();

export const formatPhone = (value, formatted = true) => {
    const digits = onlyDigits(value);
    if (!formatted) return digits;

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const generatePhone = (formatted = true, typeOrOptions = 'any') => {
    const options =
        typeof typeOrOptions === 'string' ? { type: typeOrOptions } : typeOrOptions || {};
    const type = options.type || 'any';
    const uf = options.uf || 'any';

    const dddPool = uf !== 'any' && BRAZIL_DDDS_BY_UF[uf] ? BRAZIL_DDDS_BY_UF[uf] : ALL_VALID_DDDS;
    const ddd = randomItem(dddPool);

    let isMobile;
    if (type === 'mobile') {
        isMobile = true;
    } else if (type === 'landline') {
        isMobile = false;
    } else {
        isMobile = Math.random() > 0.5;
    }

    let numberPart = '';
    if (isMobile) {
        // Celular: 9 + 8 dígitos (segundo dígito entre 6 e 9 para maior realismo)
        numberPart = `9${randomInt(6, 9)}`;
        for (let i = 0; i < 7; i++) numberPart += randomDigit();
    } else {
        // Fixo: inicia com 2, 3, 4 ou 5 + 7 dígitos
        numberPart = String(randomInt(2, 5));
        for (let i = 0; i < 7; i++) numberPart += randomDigit();
    }

    return formatPhone(`${ddd}${numberPart}`, formatted);
};

// --- CEP ---

export const CEP_REGIONS = [
    { code: 'any', label: 'Qualquer região' },
    { code: '0', label: '0 — Grande São Paulo' },
    { code: '1', label: '1 — Interior de SP' },
    { code: '2', label: '2 — RJ e ES' },
    { code: '3', label: '3 — Minas Gerais' },
    { code: '4', label: '4 — BA e SE' },
    { code: '5', label: '5 — PE, AL, PB e RN' },
    { code: '6', label: '6 — CE, PI, MA, PA, AP, AM, RR, AC' },
    { code: '7', label: '7 — DF, GO, TO, MT, MS, RO' },
    { code: '8', label: '8 — PR e SC' },
    { code: '9', label: '9 — Rio Grande do Sul' },
];

export const formatCEP = (value, formatted = true) => {
    const digits = onlyDigits(value);
    return formatted
        ? digits.replace(/(\d{5})(\d{3})/, '$1-$2')
        : digits;
};

export const generateCEP = (formatted = true, options = {}) => {
    const region = options?.region ?? 'any';

    let digits;
    do {
        digits = Array.from({ length: 8 }, randomDigit);
        if (region !== 'any') {
            digits[0] = Number(region);
        }
    } while (digits.every((d) => d === 0));

    return formatCEP(digits.join(''), formatted);
};

// --- Cartão de Crédito ---

const ELO_BINS = [
    '401178', '401179', '431274', '438935', '451416', '457393',
    '457631', '457632', '504175', '627780', '636297', '636368',
    '650031', '650405', '651652', '655000',
];

export const CARD_BRANDS = [
    { code: 'any', label: 'Qualquer bandeira' },
    { code: 'visa', label: 'Visa (16 dígitos)' },
    { code: 'mastercard', label: 'Mastercard (16 dígitos)' },
    { code: 'elo', label: 'Elo (16 dígitos)' },
    { code: 'amex', label: 'Amex (15 dígitos)' },
];

export const formatCreditCard = (value, formatted = true) => {
    const digits = onlyDigits(value);
    if (!formatted) return digits;

    if (digits.length === 15) {
        return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    return digits.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

export const generateCreditCard = (formatted = true, options = {}) => {
    const requestedBrand = options?.brand ?? 'any';
    const brand =
        requestedBrand === 'any'
            ? randomItem(['visa', 'mastercard', 'elo', 'amex'])
            : requestedBrand;

    let prefix = '4';
    let length = 16;

    if (brand === 'mastercard') {
        prefix = Math.random() > 0.3
            ? String(randomInt(51, 55))
            : String(randomInt(2221, 2720));
    } else if (brand === 'elo') {
        prefix = randomItem(ELO_BINS);
    } else if (brand === 'amex') {
        prefix = randomItem(['34', '37']);
        length = 15;
    }

    const digits = prefix.split('').map(Number);
    while (digits.length < length - 1) {
        digits.push(randomDigit());
    }

    // Dígito verificador pelo algoritmo de Luhn
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        let digit = digits[digits.length - 1 - i];
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    digits.push(checkDigit);

    return formatCreditCard(digits.join(''), formatted);
};

// --- Data ---

export const DATE_PRESETS = [
    { code: 'any', label: 'Qualquer (1950–hoje)' },
    { code: 'adult', label: 'Maior de 18 anos' },
    { code: 'minor', label: 'Menor de idade (< 18)' },
    { code: 'future', label: 'Data futura (+5 anos)' },
];

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

export const generateDate = (formatted = true, options = {}) => {
    const preset = options?.preset ?? 'any';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let start;
    let end;

    if (preset === 'adult') {
        start = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
        end = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    } else if (preset === 'minor') {
        start = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
        end = today;
    } else if (preset === 'future') {
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        end = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate());
    } else {
        start = new Date(1950, 0, 1);
        end = today;
    }

    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return formatDate(`${year}-${month}-${day}`, formatted);
};
