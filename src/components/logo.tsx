"use client"

import Image from "next/image"

interface LogoProps extends React.HTMLProps<typeof Image> {}

export function Logo({ ...props }: LogoProps) {
  return (
    <Image
      src={"/logo.svg"}
      alt=""
      height={Number(props.height || 40)}
      width={Number(props.height || 40)}
    />
  )
}
