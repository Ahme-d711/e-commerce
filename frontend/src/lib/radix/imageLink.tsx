import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { Link, useNavigate } from "react-router";
import { Avatar } from "radix-ui";
import { useLogoutMutation } from "../../server/authService";
import toast from "react-hot-toast";
import { User } from "lucide-react";
import { useCurrentUserQuery } from "../../server/userService";

const ImageLink = () => {
	const navigate = useNavigate();
	const logoutMutation = useLogoutMutation();
	const { data: user } = useCurrentUserQuery();

  
	// Handle logout button click
	const handleLogout = () => {
	  logoutMutation.mutate(undefined, {
		onSuccess: () => {
		  toast.success('Logout successful');
		  navigate('/login', { replace: true }); // Redirect to login
		},
		onError: (error) => {
		  console.error('Logout error:', error);
		  // Optionally redirect even on error to ensure user is logged out
		  navigate('/login', { replace: true });
		},
	  });
	};
	return (
		<NavigationMenu.Root className="relative z-10 flex justify-center">
			<NavigationMenu.List className="center m-0 flex list-none rounded-full p-1 shadow-[0_2px_10px] shadow-blackA4">
				<NavigationMenu.Item>
					<NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-0.5 rounded text-[15px] font-medium leading-none text-violet11 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-violet7">
						<Link to="/profile">
							<Avatar.Root className="inline-flex size-9 md:size-11 select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
								{user?.profilePic ?
									<Avatar.Image
									className="size-full rounded-[inherit] object-cover"
									src={user?.profilePic || "https://www.freepik.com/free-photos-vectors/avatar"}
									alt="Avatar"
									/> 
									:
									<User className="w-9 h-9 text-[var(--color-primary)]" />
								}
							</Avatar.Root>
						</Link>
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className="absolute right-0 top-14 w-full sm:w-auto">
						<ul className="m-0 grid list-none gap-x-2.5 p-[22px] bg-black/90 sm:w-[200px] sm:grid-flow-col sm:grid-rows-3">
							<ListItem
								title="Profile"
								href="/profile"
							>
							</ListItem>
							<ListItem
								title="My Order"
								href="/orders/my-orders"
							>
							</ListItem>
							<button         
							onClick={handleLogout}
        					disabled={logoutMutation.isPending}
							 className="w-fit pl-3 cursor-pointer">Logout</button>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	);
};

const ListItem = React.forwardRef<
	HTMLAnchorElement,
	{ className?: string; children?: React.ReactNode; title: string; href: string }
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

export default ImageLink;
