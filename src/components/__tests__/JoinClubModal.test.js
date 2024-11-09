import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JoinClubModal from '../JoinClubModal'

describe('JoinClubModal', () => {
  const mockClub = {
    name: 'Test Club'
  }
  const mockOnClose = jest.fn()

  beforeEach(() => {
    render(<JoinClubModal club={mockClub} onClose={mockOnClose} />)
  })

  it('renders form fields correctly', () => {
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/student id/i)).toBeInTheDocument()
  })

  it('updates form values on input', async () => {
    const user = userEvent.setup()
    const nameInput = screen.getByLabelText(/full name/i)
    await act(async () => {
      await user.type(nameInput, 'John Doe')
    })
    expect(nameInput.value).toBe('John Doe')
  })

  it('calls onClose when cancel button is clicked', () => {
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('handles form submission', async () => {
    const user = userEvent.setup()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      })
    )

    await act(async () => {
      await user.type(screen.getByLabelText(/full name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/student id/i), '12345')
      fireEvent.click(screen.getByText('Confirm Join'))
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/join-club', expect.any(Object))
    })
  })
})
