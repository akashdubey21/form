// basic analytics - counts for selects, avg for numbers
// text fields are skipped since they're free-form

const generateAnalytics = (fields, responses) => {
  const totalResponses = responses.length;
  const fieldStats = {};

  fields.forEach(field => {
    const { label, type } = field;

    if (type === 'select') {
      const counts = {};
      (field.options || []).forEach(opt => { counts[opt] = 0; });

      responses.forEach(r => {
        const v = r.answers?.[label];
        if (v !== undefined && v !== null && v !== '') {
          counts[v] = (counts[v] || 0) + 1;
        }
      });

      fieldStats[label] = counts;

    } else if (type === 'number') {
      const nums = responses
        .map(r => parseFloat(r.answers?.[label]))
        .filter(n => !isNaN(n));

      const avg = nums.length > 0
        ? parseFloat((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2))
        : null;

      fieldStats[label] = { average: avg, count: nums.length };
    }
  });

  return { totalResponses, fieldStats };
};

module.exports = { generateAnalytics };
