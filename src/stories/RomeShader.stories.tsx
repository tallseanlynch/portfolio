import type { Meta, StoryObj } from '@storybook/react';
import { RomeShaderCanvas } from '../components';

const meta = {
  title: 'Shaders/Rome',
  component: RomeShaderCanvas,
} satisfies Meta<typeof RomeShaderCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shader: Story = {};
