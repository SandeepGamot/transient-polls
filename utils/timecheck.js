module.exports = (timestamp) => {
  return (timestamp - Date.now()) / (60 * 60 * 1000) > 0;
};
