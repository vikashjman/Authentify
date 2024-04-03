import Hero from '@/components/hero'
import SkillMatrixImg from 'public/skill-matrix.jpg'
export default function Home() {
  return (
    <Hero 
      imgData={SkillMatrixImg} 
      imgAlt="skill matrix" 
      title="Best tool for Competency Management"
    />
  )
};