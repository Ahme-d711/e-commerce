import * as React from "react";
import { NavigationMenu } from "radix-ui";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";
import { useCurrentUserQuery } from "../../server/userService";

const NavigationMenuDemo = () => {
	const { data: user } = useCurrentUserQuery();

	return (
		<NavigationMenu.Root className="relative w-full z-10 flex justify-center">
			<NavigationMenu.List className="center m-0 flex list-none rounded-md p-1 shadow-[0_2px_10px] shadow-blackA4">
				<NavigationMenu.Item>
					<NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-0.5 rounded px-2 py-1 md:px-3 md:py-2  text-xs md:text-base font-medium leading-none text-violet11 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-violet7">
						Menu{" "}
						<CaretDownIcon
							className="relative top-px text-violet10 transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
							aria-hidden
						/>
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className="absolute left-0 min-w-72F top-0 w-full data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto">
						<ul className="one m-0 grid list-none gap-x-2.5 p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
							<li className="row-span-3 grid">
								<NavigationMenu.Link asChild>
									<a
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple9 to-indigo9 p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet7"
										href="/"
									>
										<svg
											aria-hidden
											width="38"
											height="38"
											viewBox="0 0 25 25"
											fill="white"
										>
											<path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
											<path d="M12 0H4V8H12V0Z"></path>
											<path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
										</svg>
										<div className="mb-[7px] mt-4 text-[18px] font-medium leading-[1.2]">
											Elgedawy Market
										</div>
										<p className="text-[14px] leading-[1.3] text-mauve4">
											Discover, Shop, and enjoy with ease.
										</p>
									</a>
								</NavigationMenu.Link>
							</li>

							<ListItem href="/home" title="Home">
								Your starting point to explore our products.
							</ListItem>
							<ListItem href="/products" title="Shop">
								Browser all products in one place.
							</ListItem>
							<ListItem href="/products/create-product" title="Create Product">
								Add new products to your store.
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				{user?.role === "admin" &&
					<NavigationMenu.Item>
						<NavigationMenu.Trigger className="group hidden  md:flex select-none items-center justify-between gap-0.5 rounded px-3 py-2 text-[15px] font-medium leading-none text-violet11 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-violet7">
							Dashboard{" "}
							<CaretDownIcon
								className="relative top-px text-violet10 transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
								aria-hidden
							/>
						</NavigationMenu.Trigger>
						<NavigationMenu.Content className="absolute left-0 top-0 w-full sm:w-auto">
							<ul className="m-0 grid list-none gap-x-2.5 p-[22px] sm:w-[400px] sm:grid-flow-col sm:grid-rows-3">
							<ListItem
									title="Products"
									href="/dashboard/products"
								>
									View and manger all store products.
								</ListItem>
								<ListItem
									title="Users"
									href="/dashboard/users"
								>
									Manger registered users of the store.
								</ListItem>
								<ListItem
									title="Orders"
									href="/dashboard/orders"
								>
									View and manger customer orders.
								</ListItem>
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
				}

				<NavigationMenu.Item>
					<NavigationMenu.Link
						className="select-none rounded hidden md:block px-3 py-2 text-[15px] font-medium leading-none text-violet11 no-underline outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-violet7"
						href="https://github.com/Ahme-d711"
					>
						Github
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Indicator className="top-full z-10 flex h-2.5 items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn">
					<div className="relative top-[70%] size-2.5 rotate-45 rounded-tl-sm " />
				</NavigationMenu.Indicator>
			</NavigationMenu.List>

			<div className="perspective-[2000px] absolute left-0 top-full flex w-full justify-center">
				<NavigationMenu.Viewport className="relative mt-2.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-md min-w-68 bg-black/95 transition-[width,_height] duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn sm:w-[var(--radix-navigation-menu-viewport-width)]" />
			</div>
		</NavigationMenu.Root>
	);
};

const ListItem = React.forwardRef<
	HTMLAnchorElement,
	{ className?: string; children: React.ReactNode; title: string; href: string }
>(({ className, children, title, ...props }, forwardedRef) => (
		<li>
			<NavigationMenu.Link asChild>
			<Link
				to={props.href}
				className={classNames(
					"block select-none rounded-md p-3 text-[15px] leading-none no-underline outline-none transition-colors hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-violet7",
					className,
				)}
				ref={forwardedRef}
				>
				<div className="mb-[5px] font-medium leading-[1.2] text-violet12">
					{title}
				</div>
				<p className="leading-[1.4] text-mauve11">{children}</p>
			</Link>
			</NavigationMenu.Link>
		</li>
	),
);

export default NavigationMenuDemo;
