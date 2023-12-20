import StartYellowSvg from '@/components/Svg/StartYellowSvg'
import StartGraySvg from '@/components/Svg/StartGraySvg'

export default function ProductRating({ rating }: { rating: number }) {
  const calcWidth = (order: number) => {
    if (rating >= order) {
      return '100%'
    }

    if (rating < order && rating > order - 1) {
      return `${(rating - (order - 1)) * 100}%`
    }

    return '0%'
  }

  return (
    <div className='flex items-center'>
      {[...Array(5)].map((_, index) => (
        <div
          className='relative'
          key={index}
        >
          <div
            style={{ width: calcWidth(index + 1) }}
            className='absolute left-0 top-0 h-full overflow-hidden'
          >
            <StartYellowSvg />
          </div>
          <StartGraySvg />
        </div>
      ))}
    </div>
  )
}
