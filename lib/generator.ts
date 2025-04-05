interface DataItem {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}

export function generateRandomData(count: number): DataItem[] {
  const headers = [
    "Cover page",
    "Table of contents",
    "Executive summary",
    "Technical approach",
    "Design",
    "Implementation",
    "Testing",
    "Deployment",
    "User Manual",
    "Final Report",
  ];
  const types = ["Cover page", "Table of contents", "Narrative", "Technical", "Design", "Code", "Test", "Deployment", "Instruction", "Report"];
  const statuses = ["In Process", "Done", "Pending", "Review"];
  const reviewers = ["Eddie Lake", "Jamik Tashpulatov", "Alice Johnson", "Bob Smith", "Charlie Brown"];

  const data: DataItem[] = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      header: headers[Math.floor(Math.random() * headers.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      target: String(Math.floor(Math.random() * 30)),
      limit: String(Math.floor(Math.random() * 30)),
      reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
    });
  }

  return data;
}