const generateOTP = (length: number = 6): string => {
  const max = 10 ** length;
  const n = Math.floor(Math.random() * max);
  return n.toString().padStart(length, "0");
};

export { generateOTP };
