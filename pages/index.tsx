import fs from 'fs';
import matter from 'gray-matter';
import styles from './styles.module.scss';
import { GetStaticProps } from 'next';
import { IProject } from 'models/interfaces/IProject';
import path from 'path';
import { NavLink } from 'components/reusables/NavLink';
import { SiteRoutes } from 'data/routes/SiteRoutes';
import { EyeIcon } from 'icons/Eye';
import { BaseCarousel } from 'components/reusables/carousels/BaseCarousel';
import { MapMarkerIcon } from 'icons/MapMarker';
import { CodeIcon } from 'icons/Code';
import { ProjectCardClasses, ProjectCard } from 'components/domains/portfolio/ProjectCard';
import { PageHeader } from 'components/domains/content/PageHeader';

interface FrontPageProps {
  projects: IProject[];
}


const projectClasses: ProjectCardClasses = {
  imageWrapper: styles.imageWrapper,
  image: styles.projectImage
};


const FrontPage = ({
  projects
}: FrontPageProps) => {

  const portfolioPreviews: JSX.Element[] = projects.map(
    (project): JSX.Element => (
        <div key={project.slug} className={`${styles.projectColumn}`}>
          <ProjectCard imageHeight="0px" project={project} classes={projectClasses} />
        </div>
      )
  );

  portfolioPreviews.push(
    <NavLink
      href={`/${SiteRoutes.portfolio}`}
      className={`${styles.projectColumn} ${styles.viewMoreSlide} ${styles.projectImage} d-flex text-center text-light card bg-primary`}
    >
      <EyeIcon />
      <div className="my-3">
        Click for more projects
      </div>
    </NavLink>
  )


  return (

    <>
    <PageHeader hideTabTitle mobileOnly pageTitle="Hi, I'm Martin!" />

    <main className={`${styles.about} d-flex`}>
      <div className={`${styles.profile} content`}>


        <div className={`text-light hide-lg d-flex flex-col ${styles.introHeader}`} >
          <h1 className="mb-0 d-inline-flex bg-primary px-3 py-2 card">
            Hi, I'm Martin!
          </h1>

          <div className="d-flex justify-center hide-lg mt-3" style={{ fontSize: '.85rem', flexWrap: 'wrap' }}>
            <span className="py-1 text-light d-flex mr-5 align-center">
              <CodeIcon className="mr-2 d-flex" style={{ fontSize: '1.1em' }} />
              Frontend Developer
            </span>

            <span className="py-1 text-light d-flex align-center">
              <MapMarkerIcon className="mr-2 d-flex" style={{ fontSize: '.75em' }} />
              Gentofte, Denmark
            </span>
          </div>
        </div>

        <div className={`${styles.secondaryText} text-light py-3`}>
          <div className="hide-lg mt-3">
            <p>
              I build <b>Fast & User-friendly experiences</b> with a focus <b>UX, maintainability and performance</b>
            </p>
            <p className="mb-0">
              I have background as a Multimedia Designer and a Fullstack Web Developer and have been a part of the web development world since 2015.
            </p>
          </div>
          <div className="show-lg fw-medium text-left pb-3" style={{ fontSize: 'min(4vh, 2.25rem)', lineHeight: 1 }}>
            I build
            <div className="mt-2 mb-3">
              <span className="mx-0 fw-bold" style={{ lineHeight: 1, fontSize: '1.4em' }}>
                <div>
                  Fast<span className="text-secondary ml-2 fw-medium" style={{ fontSize: '.75em' }}>&</span>
                  </div>
                  Focused
                </span>
            </div>
            User experiences
          </div>
        </div>
      </div>

      <div className={`${styles.content}`}>

        <div className={`${styles.workSection} content mb-4`}>
          <div className="d-flex justify-center align-end justify-space-between">
            <h4 className="text-light pr-1 pb-2" style={{ marginBottom: 0 }}>
              My work
            </h4>
            <NavLink className={`ml-a btn btn-link hide-md text-light ${styles.viewMoreButton}`} href={`/${SiteRoutes.portfolio}`}>
              <EyeIcon className="mr-3 text-light" />
              View all work
            </NavLink>
          </div>
        </div>


        <div className={`${styles.projectCarousel} content`}>
          <BaseCarousel
            slidesPerView="auto"
            spaceBetween={15}
            children={portfolioPreviews}
            centerInsufficientSlides={true}
            classNames={{
              nextNavButton: styles.nextSlideButton,
              prevNavButton: styles.prevSlideButton
            }}
          />
        </div>
      </div>
    </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<FrontPageProps> = async () => {
  const projectsFolder: string = 'data/posts/projects';
  // Get the content of the md file by checking for it using the file name + the .md extension
  const postFileNames: string[] = fs.readdirSync(projectsFolder).slice(0, 3); // Get only the first 3 as a preview

  const projects: IProject[] = await Promise.all(postFileNames.map(
    (fn): Promise<IProject> => new Promise((res, rej) => {


      try {
        fs.readFile(path.join(projectsFolder, fn), async (err, data) => {

          if (err) {
            rej(err);
            return;
          }

          try {
            const { data: { title, role, url, skills, images } } = matter(data.toString());

            res({
              title,
              slug: fn.replace('.md', ''),
              url,
              images: images.slice(0, 1),
              role,
              skills
            });
          } catch (error) {
            console.log(error);
            rej(error);
          }

        });

      } catch (error) {
        console.log(error);
        rej(error);
      }
    })
  ))

  return {
    props: {
      projects
    }
  }
}

export default FrontPage

