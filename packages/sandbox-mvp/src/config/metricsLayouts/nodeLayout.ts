export const nodeLayout = [];

const keys = [
  {
    metric: 'node.v8.total_heap_size',
    title: 'Total Heap Size',
  },
  {
    metric: 'node.v8.used_heap_size',
    title: 'Used Heap Size',
  },
  {
    metric: 'node.v8.total_heap_size_executable',
    title: 'Total Heap Size Executable',
  },
  {
    metric: 'node.v8.total_available_size',
    title: 'Total Available Size',
  },
  {
    metric: 'node.v8.malloced_memory',
    title: 'Malloced Memory',
  },
  {
    metric: 'node.v8.total_physical_size',
    title: 'Total Physical Size',
  },
];

const charts = [];

for (const key of keys) {
  const config = {
    title: key.title,
    groupByOnHost: ['pid'],
    groupByOnCluster: ['hostname'],
    analyseHigherLower: true,
    indicators: [
      {
        type: 'number',
        aggregator: 'sum',
        metric: key.metric,
        unit: '',
        title: key.title,
      },
    ],
  };
  charts.push(config);
}


nodeLayout.push({ title: 'Heap Stats', charts });


const spaceKinds = [
  {
    name: 'new_space',
    title: 'New Space',
  },
  {
    name: 'old_space',
    title: 'Old Space',
  },
  {
    name: 'code_space',
    title: 'Code Space',
  },
  {
    name: 'map_space',
    title: 'Map Space',
  },
  {
    name: 'large_object_space',
    title: 'Large Object Space',
  },
];

const wantedIndicators = [
  {
    name: 'space_size',
    title: 'Space Size',
  },
  {
    name: 'space_used_size',
    title: 'Space Used Size',
  },
  {
    name: 'space_available_size',
    title: 'Space Available Size',
  },
  {
    name: 'physical_space_size',
    title: 'Physical Space Size',
  },
];

for (const spaceKind of spaceKinds) {
  const charts = [];
  for (const wi of wantedIndicators) {
    const indicators = [];
    indicators.push(
      {
        type: 'number',
        aggregator: 'sum',
        metric: `node.v8.${spaceKind.name}.${wi.name}`,
        unit: '',
        title: wi.title,
      }
    );
    charts.push({
      groupByOnHost: ['pid'],
      groupByOnCluster: ['hostname'],
      analyseHigherLower: true,
      title: `${spaceKind.title} - ${wi.title}`,
      indicators,
    });
  }
  nodeLayout.push({
    title: spaceKind.title,
    charts,
  });
}

