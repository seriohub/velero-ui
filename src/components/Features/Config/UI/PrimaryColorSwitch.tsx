import { ColorPicker, Text, Box } from '@mantine/core';
import { useUIStatus } from '@/contexts/UIContext';

const swatchesWithNames = [
  {
    name: 'dark',
    color: '#2e2e2e',
  },
  {
    name: 'gray',
    color: '#868e96',
  },
  {
    name: 'red',
    color: '#fa5252',
  },
  {
    name: 'pink',
    color: '#e64980',
  },
  {
    name: 'grape',
    color: '#be4bdb',
  },
  {
    name: 'violet',
    color: '#7950f2',
  },
  {
    name: 'indigo',
    color: '#4c6ef5',
  },
  {
    name: 'blue',
    color: '#228be6',
  },
  {
    name: 'cyan',
    color: '#15aabf',
  },
  {
    name: 'teal',
    color: '#12b886',
  },
  {
    name: 'green',
    color: '#40c057',
  },
  {
    name: 'lime',
    color: '#82c91e',
  },
  {
    name: 'yellow',
    color: '#fab005',
  },
  {
    name: 'orange',
    color: '#fd7e14',
  },
];

export default function PrimaryColorSwitch() {
  const { setPrimaryColor } = useUIStatus(); // Usa il contesto per gestire il colore primario

  function setColor(value: any) {
    swatchesWithNames.map((item) => {
      if (value === item.color) {
        // console.log(item.name);
        setPrimaryColor(item.name);
        localStorage.setItem('primaryColor', item.name);
      }
    });
  }

  return (
    <>
      <Box maw={400} mx="auto">
        <Text size="sm" mt={50} fw={500}>
          Primary color
        </Text>

        <ColorPicker
          withPicker={false}
          format="hex"
          swatches={swatchesWithNames.map((swatch) => swatch.color)} // Usa solo i colori
          onChange={(value) => setColor(value)} // Imposta il colore nel contesto
        />
      </Box>
    </>
  );
}
