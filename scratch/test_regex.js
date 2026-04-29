const isUuid = (value = '') =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

console.log("isUuid('2'):", isUuid('2'));
console.log("isUuid('550e8400-e29b-41d4-a716-446655440000'):", isUuid('550e8400-e29b-41d4-a716-446655440000'));
