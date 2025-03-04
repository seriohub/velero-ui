import { useEffect, useState } from 'react';
import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  useCombobox,
  Input,
  ScrollArea,
} from '@mantine/core';

interface SearchableMultiSelectProps {
  label: string;
  content: any[];
  form: any;
  fieldName: string;
  description?: string;
  initialValue: [];
}

export function SearchableMultiSelect({
  label = '',
  content = [],
  form,
  fieldName,
  initialValue,
  description = '',
}: SearchableMultiSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const [value, setValue] = useState<string[]>(initialValue);

  const handleValueSelect = (val: string) =>
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  useEffect(() => {
    form.setFieldValue(fieldName, value);
    setSearch('');
  }, [value]);

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = content
    .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Input.Wrapper label={label} description={description}>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
        <Combobox.DropdownTarget >
          <PillsInput onClick={() => combobox.openDropdown()}>
            <Pill.Group>
              {values}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder="Search values"
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && search.length === 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <ScrollArea h={250}>
            <Combobox.Options>
              {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
            </Combobox.Options>
          </ScrollArea>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
}
