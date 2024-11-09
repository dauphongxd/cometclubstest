import { render, screen, fireEvent } from '@testing-library/react'
import ClubCard from '../ClubCard'

describe('ClubCard', () => {
  const mockClub = {
    name: 'Test Club',
    description: 'Test Description',
    category: 'Test Category'
  }
  const mockOnJoinClick = jest.fn()

  beforeEach(() => {
    render(<ClubCard club={mockClub} onJoinClick={mockOnJoinClick} />)
  })

  it('renders club information correctly', () => {
    expect(screen.getByText('Test Club')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('calls onJoinClick when join button is clicked', () => {
    const joinButton = screen.getByText('Join Club')
    fireEvent.click(joinButton)
    expect(mockOnJoinClick).toHaveBeenCalledWith(mockClub)
  })
})
