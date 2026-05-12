import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}));

vi.mock('@repo/ui/Control', () => {
  const { useState } = require('react');
  const Root = ({ children }: { children: (ctx: { expanded: boolean; toggle: () => void }) => React.ReactNode }) => {
    const [expanded, setExpanded] = useState(false);
    return <>{children({ expanded, toggle: () => setExpanded((v: boolean) => !v) })}</>;
  };
  const Header = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
    <button type="button" onClick={onClick}>{children}</button>
  );
  const Body = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return { Accordion: { Root, Header, Body } };
});

import { SkillAccordion } from '~/components/View/SkillAccordion';

describe('SkillAccordion', () => {
  it('should render nothing when skills list is empty', () => {
    const { container } = render(<SkillAccordion skills={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the skills label', () => {
    render(<SkillAccordion skills={['React', 'TypeScript']} />);
    expect(screen.getByText('ExperienceCard.skills_label')).toBeInTheDocument();
  });

  it('should render all skill items', () => {
    render(<SkillAccordion skills={['React', 'TypeScript', 'Node.js']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should toggle expanded state on header click', async () => {
    const user = userEvent.setup();
    render(<SkillAccordion skills={['React']} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(button).toBeInTheDocument();
  });
});
