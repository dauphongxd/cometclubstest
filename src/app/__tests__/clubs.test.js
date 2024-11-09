import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClubsPage from '../clubs/page'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

describe('ClubsPage', () => {
  beforeEach(() => {
    render(<ClubsPage />)
  })

  it('renders the page title', () => {
    expect(screen.getByText('Comet Clubs')).toBeInTheDocument()
  })

  it('filters clubs based on search input', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText('Search clubs...')
    
    await act(async () => {
      await user.type(searchInput, 'Computer')
    })
    
    expect(screen.getByText('Computer Science Club')).toBeInTheDocument()
    expect(screen.queryByText('Photography Club')).not.toBeInTheDocument()
  })

  it('filters clubs by category', async () => {
    const technologyButton = screen.getByTestId('category-technology')
    
    await act(async () => {
      fireEvent.click(technologyButton)
    })
    
    expect(screen.getByText('Computer Science Club')).toBeInTheDocument()
    expect(screen.getByText('Robotics Club')).toBeInTheDocument()
    expect(screen.queryByText('Photography Club')).not.toBeInTheDocument()
  })

  it('opens join modal when clicking join button', async () => {
    const joinButtons = screen.getAllByText('Join Club')
    fireEvent.click(joinButtons[0])
    
    expect(screen.getByText('Full Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })
})
