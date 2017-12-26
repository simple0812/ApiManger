function getName(api, parent) {
  parent = parent || {};
  if (api.object_type === 1) return `${api.name}()`;
  if (api.object_type === 2) {
    if(parent.table_name == 'Api' && parent.group_type=='collection' && api.class_name) {
      return `${api.class_name}.${api.name}()`
    }

    return `${parent.name}.${api.name}()`;
  }
  if (api.object_type === 4) {
    if(parent.table_name == 'Api' && parent.group_type=='collection' && api.class_name) {
      return `${api.class_name}.${api.name}`;
    }

    return `${parent.name}.${api.name}`;
  }
  if (api.object_type === 5) return `${api.name}{}`;
  return api.name;
}

export { getName }