import { FIGURE } from './figures';

export const content = `## It all started with Devil May Cry

I've always been a fan of *Devil May Cry*.

For those who don't know it, it's a Capcom game franchise known for its frantic combat, memorable characters and a very distinctive visual identity. When Netflix released an animated adaptation, I was naturally interested.

After watching it, curiosity led me to look into who was behind the production.

That's how I came across **Studio Mir**, a South Korean animation studio responsible for works such as *The Legend of Korra*, *The Witcher: Nightmare of the Wolf* and *X-Men '97*.

My goal was simple: get to know the studio better, discover other productions and explore its portfolio.

I wasn't looking for technical problems. Nor did I intend to evaluate the website.

I just wanted to learn about the work of a company that had earned my admiration.

But when I opened the site, something caught my attention.

Some images took a long time to load. Others didn't seem to respect their proportions. The portfolio presentation, while visually interesting, also felt limited.

As a software developer, my first reaction was to try to understand what was going on.

Were the images too large? Infrastructure problems? Some implementation decision?

After a few moments, though, a more interesting question started to emerge.

**How much can a poor digital experience hurt the way we perceive a company, even when its work is exceptional?**

## The first impression is part of the experience too

Imagine discovering an animation studio after watching a production you really enjoyed.

You search for the company's name, find its website and open the page expecting to see more of its work.

But before you find any content, you have to wait.

And keep waiting.

Something similar happened when I visited Studio Mir's website.

To better understand the behavior, I decided to run an investigation using auditing tools and automated browser recordings.

In one of the recordings, made on October 18, 2026, from Brazil, the homepage stayed completely blank for about **14.3 seconds on desktop**. On a mobile run, it was **7.9 seconds**.

These numbers don't necessarily represent every visitor's experience. They were one-off observations, with an empty cache and no artificial network throttling. Different connection conditions, locations and infrastructure may produce different results.

Even so, the recordings document an experience quite far from what you'd expect when visiting a visual portfolio.

![Recording of the Studio Mir homepage loading on desktop: the page stays blank for several seconds before showing any content](${FIGURE.homeLoad})

*Recording from October 18, 2026, made from Brazil, at real speed. The GIF shows an excerpt of the original session; the timer shows the time elapsed since the page was requested.*

There's a difference between knowing a page is slow and experiencing that slowness.

For those who build software, a few seconds can look like just another metric.

For those browsing, they are seconds in which nothing happens.

No work appears. No information is shown. No expectation is met.

And visitors shouldn't need to understand the technical reasons in order to explore the content they came for.

## The image paradox

Perhaps the most curious aspect of this investigation is that one of the biggest problems found involves precisely the images.

For an animation studio, visual content isn't just decoration. It's an essential part of what the company offers.

Images present characters, art styles, productions and creative capabilities. They are what let visitors recognize the quality of the work.

But when these assets aren't delivered properly, they can end up hurting the very experience they were meant to enrich.

During the audit, we found a telling example.

A JPEG image of roughly **12.6 MB**, at 7952 × 5304 pixels, was used in a visual area of just 566 × 283 pixels.

To put that in perspective, we're talking about an image with more than 42 million pixels filling a relatively small space in the interface.

We also found portfolio thumbnails with files close to 4 MB each.

This isn't an argument for low-quality images. Especially in an art portfolio, preserving visual fidelity matters.

The point is that quality and efficiency don't have to be conflicting goals.

Images can be resized, compressed and delivered in appropriate formats, taking different devices and resolutions into account.

The browser doesn't need to download the same gigantic image to display it in a small area of the screen.

![Studio Mir homepage with the 566 × 283 pixel slot highlighted, still partially loaded, where the original 7952 × 5304 pixel, 12.6 MB image is displayed](${FIGURE.oversizedImage})

*Example observed in the October 18, 2026 audit. The original image was 7952 × 5304 pixels and roughly 12.6 MB, although it was displayed in a 566 × 283 pixel region.*

This problem illustrates something bigger.

A seemingly technical decision, such as how to deliver an image, can directly affect people's access to a company's content.

And when that content is precisely what demonstrates the quality of the business, the relationship becomes even more relevant.

## A portfolio is not just a gallery

There's another aspect I consider important.

When we finally get to see Studio Mir's work, we find a visually strong portfolio.

These are well-known productions, familiar characters and projects that help demonstrate the studio's relevance in the animation industry.

The grid layout works well visually, and the images manage to convey the diversity of the work.

But a professional portfolio needs to do more than show beautiful images.

It also needs to help people understand, discover and share the work.

During the analysis, we found 25 items in the portfolio. Titles were shown when hovering the mouse over the images.

On mobile devices, where that interaction doesn't work the same way, the titles weren't available in the grid.

We also noticed that projects had no individual, directly shareable addresses.

Imagine finding an interesting production and wanting to send it to a colleague.

Instead of sharing a link to that specific project, you have to point the person to the portfolio and hope they find the same content.

It may seem like a small detail.

But it's precisely through these interactions that a portfolio stops being just a collection of work and starts working as a communication tool.

![Studio Mir portfolio grid with thumbnails of productions such as Devil May Cry, X-Men '97, The Witcher: Nightmare of the Wolf and Dota: Dragon's Blood](${FIGURE.portfolioGrid})

*The portfolio brings together internationally recognized productions in an attractive visual layout.*

![Side-by-side comparison: on desktop, the project title appears over the thumbnail on hover; on mobile, the same thumbnail is shown without a title](${FIGURE.titlesDesktopVsMobile})

*On desktop, titles appear when hovering over the images. Mobile browsing limits this discovery.*

For a creative company, presenting its work is part of demonstrating its capabilities.

A potential client may want to understand the studio's experience with a certain type of production.

A professional interested in working there may want to see its past projects.

A fan may simply want to discover other animations made by the same team.

These are different audiences with different goals, but they all depend on the website's ability to communicate information clearly.

## The cost that doesn't show up in Lighthouse

As part of the investigation, we ran 18 audits with Lighthouse, a tool used to evaluate different aspects of web page quality.

The performance results were:

| Page | Desktop | Mobile |
|---|---:|---:|
| Homepage | 32/100 | 33/100 |
| Portfolio | 64/100 | 54/100 |
| Project | 63/100 | 54/100 |

*Medians of three runs per environment, carried out on October 18, 2026. The tests used Lighthouse's simulated conditions. Loading was incomplete in 15 of the 18 runs, so these results should be read with caution and do not represent real-user data.*

The numbers help show that there are technical opportunities for improvement.

But I believe the most important reflection isn't in the scores.

Lighthouse can point out loading problems, but it can't directly answer questions like:

- Did a visitor stop exploring the portfolio because the experience felt slow?
- Did a potential partner easily find the productions relevant to their project?
- Was a professional interested in the studio able to understand its capabilities?
- Did the digital presentation reinforce the artistic quality perceived in the animations?

These questions involve behavior, expectations, trust and business goals.

To answer them conclusively, we would need data that isn't publicly available, such as visitor behavior analytics, user research and the company's business information.

So it wouldn't be fair to claim that Studio Mir lost clients or contracts because of its website.

But we can identify possible points of friction and reflect on how they interfere with communicating value.

**A digital experience doesn't need to be the cause of a proven financial loss to deserve attention.**

It can also be an opportunity to strengthen how a brand presents itself, make its products easier to discover and respect its visitors' time.

## The solution doesn't have to start with a redesign

Faced with problems like these, it would be tempting to propose rebuilding the website from scratch.

A modern interface, new animations, a different architecture, newer technologies.

But would that solve the main problem?

The investigation suggests that a significant part of the issues found could be addressed without necessarily changing the site's visual identity.

Image loading could be improved through more efficient formats, multiple resolutions and proper lazy-loading strategies.

Asset delivery could benefit from better cache and connection configuration.

Navigation could offer more accessible titles and links to specific projects.

These are improvements that start from concrete problems, not simply from the desire to use newer technologies.

And that distinction matters.

An engineering decision shouldn't be judged only by the elegance of its implementation, but also by the problem it solves and the value it delivers.

The best path isn't always to rebuild everything.

Sometimes it's making what already exists work better for people.

## Beyond the code

This experience made me think about a shift in perspective that I consider important in my journey as a software engineer.

Throughout our careers, it's natural to spend a lot of time learning languages, frameworks, architectures and best practices.

That knowledge is fundamental.

But there's a dimension of software development that goes beyond implementation.

We need to understand why we're building a given solution, who will benefit from it and what results we expect to produce.

In Studio Mir's case, my curiosity started with a few images that were slow to load.

The investigation revealed issues of performance, visual presentation and portfolio organization.

But the reflection that stayed with me was a different one.

We're talking about a studio whose work is able to impress people around the world. Its productions show creativity, talent and technical skill.

Its website is an opportunity to bring people even closer to that work.

And for that, the digital experience needs to be treated as part of the company's communication, not just as a concern for whoever writes the code.

## Final thoughts

When I opened Studio Mir's website, I didn't expect to find something to write about.

I just wanted to learn more about the artists and professionals behind an animation based on one of my favorite games.

I ended up finding an opportunity to reflect on something I consider increasingly relevant in software development: the relationship between technical choices, human experience and business value.

Studio Mir's work remains admirable, regardless of the limitations found on its website.

And perhaps it's precisely because I admire that work that the experience caught my attention so much.

In the end, the question that remained isn't just how to make a page faster.

It's how to make sure technology helps a company communicate the quality it already has.

**Because sometimes the best contribution software engineering can make isn't creating something new, but removing the obstacles between people and what they came to find.**

---

### About the investigation

This analysis was carried out with browser automation tools, screen recording and Lighthouse, using Studio Mir's public pages on October 18, 2026.

We ran 18 synthetic audits, along with navigation captures, an asset inventory and an analysis of the portfolio's structure.

The observations reflect the conditions and period of the tests. No real-user data (CrUX) was collected, and no conclusion about financial or commercial losses was drawn.

*Studio Mir, Devil May Cry and the other names and works mentioned belong to their respective owners. This article is an independent analysis and has no affiliation with the studio.*

## References

- [Studio Mir](https://www.studiomir.co.kr/en/): the studio's official website, analyzed in this investigation.
- [Introduction to Lighthouse](https://developer.chrome.com/docs/lighthouse/overview): what the tool measures and how to run it.
- [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): how the 0–100 scores in the table above are calculated.
- [Properly size images](https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images): the audit that flags images larger than the area they are displayed in.
- [Serve images in modern formats](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images): WebP and AVIF as lighter alternatives to JPEG.
- [Browser-level image lazy loading for the web](https://web.dev/articles/browser-level-image-lazy-loading): loading images on demand with the \`loading\` attribute.
- [Why lab and field data can be different](https://web.dev/articles/lab-and-field-data-differences): why synthetic audits don't replace real-user data.
- [Overview of CrUX](https://developer.chrome.com/docs/crux): the Chrome UX Report, the public source of field data mentioned in the methodology note.
`;
