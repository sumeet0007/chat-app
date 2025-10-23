import { render, screen, fireEvent } from '@testing-library/react';
import ChatArea from '../app/components/ChatArea';
import { describe, it, expect, vi } from 'vitest';

describe('ChatArea', () => {
  const mockProps = {
    selectedFriend: { _id: '1', email: 'test@example.com' },
    messages: ['Test: Hello', 'You: Hi'],
    message: '',
    sendMessage: vi.fn(),
    setMessage: vi.fn(),
    setShowSidebar: vi.fn(),
  };

  it('renders welcome message when no friend selected', () => {
    render(<ChatArea {...mockProps} selectedFriend={null} />);
    expect(screen.getByText('Welcome to Discord Clone')).toBeInTheDocument();
  });

  it('renders messages when friend is selected', () => {
    render(<ChatArea {...mockProps} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });

  it('calls sendMessage when form is submitted', () => {
    render(<ChatArea {...mockProps} message="test message" />);
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockProps.sendMessage).toHaveBeenCalled();
  });
});