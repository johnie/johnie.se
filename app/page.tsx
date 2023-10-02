import Image from 'next/image';
import { Logo } from '@/components/logo';
import { LucideGithub, LucideLinkedin, LucideInstagram, LucideMail } from 'lucide-react';

export default function Home() {
  return (
    <main className="mx-auto">
      <div className="md:max-w-[460px] m-6 md:m-20 text-neutral-700 dark:text-neutral-300">
        <div className="flex gap-x-4">
          <div className="flex flex-col">
            <div className="my-8">
              <Logo />
            </div>
            <h1 className="mt-[6px]">
              <span className="font-semibold">Johnie Hjelm</span> is committed to developing individuals and teams for success.
            </h1>
            <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
              Since my teens, I&lsquo;ve been immersed in both design and coding, refusing to be pigeonholed into a single specialty. I&lsquo;ve thrived as a Jack of all Trades in
              various teams, dabbling in everything from graphic and digital design to front and backend development, as well as product and API strategy.
            </p>
            <p className="leading-[25px] mt-8 text-neutral-500 dark:text-neutral-400">
              Beyond tech, I&lsquo;m passionate about effective team leadership and smart work practices. I believe that a team&lsquo;s well-being is central to smooth operations
              and that while ideas spark innovation, it&lsquo;s execution that drives success.
            </p>
            <div className="flex -ml-2 mt-6 items-center">
              <a href="mailto:johnie@hjelm.im" className="p-3 rounded-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-900 border-none text-neutral-400 dark:text-neutral-400">
                <LucideMail className="h-[18px] w-[18px] text-current" />
              </a>
              <a href="https://github.com/johnie" className="p-3 rounded-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-900 border-none text-neutral-400 dark:text-neutral-400">
                <LucideGithub className="h-[18px] w-[18px] text-current" />
              </a>
              <a
                href="https://linkedin.com/in/johniehjelm"
                className="p-3 rounded-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-900 border-none text-neutral-400 dark:text-neutral-400"
              >
                <LucideLinkedin className="h-[18px] w-[18px] text-current" />
              </a>
              <a
                href="https://instagram.com/johnie"
                className="p-3 rounded-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-900 border-none text-neutral-400 dark:text-neutral-400"
              >
                <LucideInstagram className="h-[18px] w-[18px] text-current" />
              </a>
            </div>
            <h3 className="mt-10 text-sm text-neutral-400 mb-2 lowercase">Work</h3>
            <a className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group" href="https://bambuser.com">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-full mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
                <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                  <Image src={'/bambuser.png'} alt="Bambuser logo" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" className="w-[36px] h-[36px]" />
                </div>
              </div>
              <div className="flex flex-col text-sm border-b border-neutral-100 dark:border-neutral-900  flex-auto  pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300">
                <div>Bambuser</div>
                <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                  <div>Technical Lead Manager</div>
                  <div className="text-neutral-400 dark:text-neutral-500 tabular-nums">2021 – Now</div>
                </div>
              </div>
            </a>
            <a className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group" href="https://mrgreen.com">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-full mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
                <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                  <Image src={'/mrgreen.png'} alt="Mr Green logo" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" className="w-[36px] h-[36px]" />
                </div>
              </div>
              <div className="flex flex-col text-sm border-b border-neutral-100 dark:border-neutral-900  flex-auto  pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300">
                <div>Mr Green – Gametek</div>
                <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                  <div>Fullstack Developer & Technical Lead</div>
                  <div className="text-neutral-400 dark:text-neutral-500 tabular-nums">2018 – 2020</div>
                </div>
              </div>
            </a>
            <a className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group" href="https://cloudnine.se">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-full mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
                <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                  <Image src={'/cloudnine.png'} alt="Cloudnine logo" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" className="w-[36px] h-[36px]" />
                </div>
              </div>
              <div className="flex flex-col text-sm border-b border-neutral-100 dark:border-neutral-900  flex-auto  pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300">
                <div>Cloudnine</div>
                <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                  <div>Senior Software Engineer</div>
                  <div className="text-neutral-400 dark:text-neutral-500 tabular-nums">2016 – 2018</div>
                </div>
              </div>
            </a>
            <a className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group" href="https://symbio.com">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-full mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
                <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                  <Image src={'/symbio.png'} alt="Symbio logo" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" className="w-[36px] h-[36px]" />
                </div>
              </div>
              <div className="flex flex-col text-sm border-b border-transparent  flex-auto  pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300">
                <div>Symbio Sweden</div>
                <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                  <div>Fullstack Developer</div>
                  <div className="text-neutral-400 dark:text-neutral-500 tabular-nums">2013 – 2016</div>
                </div>
              </div>
            </a>
            <h3 className="mt-10 text-sm text-neutral-400 mb-2 lowercase">Projects</h3>
            <a className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group" href="https://crip.io">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-[10px] mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
                <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                  <Image src={'/crip.png'} alt="Crip in Tech logo" loading="lazy" width="36" height="36" decoding="async" className="w-[36px] h-[36px]" />
                </div>
              </div>
              <div className="flex flex-col text-sm border-b border-neutral-100 dark:border-neutral-900  flex-auto  pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300">
                <div>Crip in Tech</div>
                <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                  <div>Incubator for crips in tech</div>
                  <div className="bg-neutral-100 border border-black border-opacity-5 px-2 text-xs rounded-full dark:bg-neutral-800 dark:text-neutral-500">web</div>
                </div>
              </div>
            </a>
            <a className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group" href="https://alcocheck.se">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-[10px] mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
                <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                  <Image src={'/alcocheck.png'} alt="Crip in Tech logo" loading="lazy" width="36" height="36" decoding="async" className="w-[36px] h-[36px]" />
                </div>
              </div>
              <div className="flex flex-col text-sm border-b border-neutral-100 dark:border-neutral-900  flex-auto  pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300">
                <div>Alcocheck</div>
                <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                  <div>Breathalyzer notfication system</div>
                  <div className="bg-neutral-100 border border-black border-opacity-5 px-2 text-xs rounded-full dark:bg-neutral-800 dark:text-neutral-500">web</div>
                </div>
              </div>
            </a>
            <a className="flex gap-x-4 px-4 -mx-4 pt-4 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 group" href="https://allaraknas.se">
              <div className="bg-neutral-100 dark:bg-neutral-800 w-[36px] h-[36px] rounded-[10px] mt-[2px] flex-shrink-0 shadow-shorter overflow-hidden">
                <div className="text-sm text-neutral-400 font-semibold flex justify-center items-center h-full">
                  <Image src={'/allaraknas.png'} alt="Crip in Tech logo" loading="lazy" width="36" height="36" decoding="async" className="w-[36px] h-[36px]" />
                </div>
              </div>
              <div className="flex flex-col text-sm  flex-auto  pb-4 text-neutral-700 group-hover:border-transparent dark:text-neutral-300">
                <div>#allaräknas</div>
                <div className="text-neutral-500 dark:text-neutral-500 flex justify-between gap-x-2 items-center">
                  <div>Campaign for equal medical treament</div>
                  <div className="bg-neutral-100 border border-black border-opacity-5 px-2 text-xs rounded-full dark:bg-neutral-800 dark:text-neutral-500">web</div>
                </div>
              </div>
            </a>
            <div className="text-sm flex items-center text-neutral-400 mt-8 mb-4">
              <div className="animate-ping rounded-full bg-green-400 h-[8px] w-[8px] inline-block mr-2 absolute"></div>
              <div className="rounded-full bg-green-400 h-[8px] w-[8px] inline-block mr-2"></div>{'Actively looking for new projects. '}
              <a href="mailto:johnie@hjelm.im" className="border-b border-neutral-400">
                Get in touch!
              </a>
            </div>
            <h3 className="mt-20 text-sm text-neutral-400 mb-2">© {new Date().getFullYear().toString()} Johnie Hjelm.</h3>
          </div>
        </div>
      </div>
    </main>
  );
}
