// Formatting helper functions
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const formatCurrency = (amount) => {
    return `Γé╣${amount.toLocaleString('en-IN')}`;
};
