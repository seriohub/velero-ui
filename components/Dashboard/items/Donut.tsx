import { DonutChart } from '@mantine/charts';
interface DonutProps {
  data: any;
}

export function Donut({ data }: DonutProps) {
  return <DonutChart data={data} />;
}
